const Django = (projectName = "django-backend", needTestFiles = false) => {
  const baseName = projectName.replace(/\s+/g, "_").toLowerCase();
  const appName = "core";

  const files = {
    "README.md": `# ${projectName}

## Setup

1. Create virtual environment
\`\`\`bash
python -m venv venv
source venv/bin/activate  # or venv\\Scripts\\activate on Windows
\`\`\`

2. Install dependencies
\`\`\`bash
pip install -r requirements.txt
\`\`\`

3. Run migrations and start the server
\`\`\`bash
python manage.py migrate
python manage.py runserver
\`\`\`
`,

    ".gitignore": `venv/
__pycache__/
db.sqlite3
.env
*.pyc
*.pyo
*.log`,

    ".env": `DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3`,

    "requirements.txt": `Django>=4.2
python-dotenv`,

    "manage.py": `#!/usr/bin/env python
import os
import sys
if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', '${baseName}.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError("Couldn't import Django.") from exc
    execute_from_command_line(sys.argv)
`,

    [`${baseName}/__init__.py`]: ``,

    [`${baseName}/settings.py`]: `import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = os.getenv('SECRET_KEY', 'fallback-secret-key')
DEBUG = os.getenv('DEBUG', 'True') == 'True'
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '127.0.0.1').split(',')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    '${appName}',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = '${baseName}.urls'

TEMPLATES = [{
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'DIRS': [],
    'APP_DIRS': True,
    'OPTIONS': {'context_processors': [
        'django.template.context_processors.debug',
        'django.template.context_processors.request',
        'django.contrib.auth.context_processors.auth',
        'django.contrib.messages.context_processors.messages',
    ]}
}]

WSGI_APPLICATION = '${baseName}.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

STATIC_URL = 'static/'
`,

    [`${baseName}/urls.py`]: `from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('${appName}.urls')),
]`,

    [`${baseName}/wsgi.py`]: `import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', '${baseName}.settings')
application = get_wsgi_application()
`,

    [`${appName}/__init__.py`]: ``,

    [`${appName}/admin.py`]: `from django.contrib import admin
from .models import Sample

admin.site.register(Sample)
`,

    [`${appName}/apps.py`]: `from django.apps import AppConfig

class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = '${appName}'
`,

    [`${appName}/models.py`]: `from django.db import models

class Sample(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
`,

    [`${appName}/views.py`]: `from django.http import JsonResponse

def health_check(request):
    return JsonResponse({"status": "UP"})
`,

    [`${appName}/urls.py`]: `from django.urls import path
from .views import health_check

urlpatterns = [
    path('health/', health_check),
]`,
  };

  if (needTestFiles) {
    files[`${appName}/tests.py`] = `from django.test import TestCase
from django.urls import reverse

class HealthCheckTest(TestCase):
    def test_health_check_returns_up(self):
        response = self.client.get('/api/health/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'status': 'UP'})
`;
  }

  return { files };
};

export default Django;
