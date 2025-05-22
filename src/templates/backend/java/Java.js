const Java = (projectName, needTestFiles = false, type = "Rest") => {
  const baseName = projectName || "springboot-java-appgen";
  const isGraphQL = type === "GraphQL";

  const files = {
    "README.md": `# ${baseName}

## Build and Run

- \`./mvnw spring-boot:run\` - Run the application
- \`./mvnw test\` - Run tests
`,

    ".gitignore": `target/
.idea/
*.iml
*.class
*.jar
*.war
.env`,

    "pom.xml": `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" ...>
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.example</groupId>
  <artifactId>${baseName.toLowerCase().replace(/\s+/g, "-")}</artifactId>
  <version>0.0.1-SNAPSHOT</version>
  <name>${baseName}</name>

  <properties>
    <java.version>17</java.version>
    <spring-boot.version>3.2.0</spring-boot.version>
  </properties>

  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
${
  isGraphQL
    ? `    <dependency>
      <groupId>com.graphql-java</groupId>
      <artifactId>graphql-spring-boot-starter</artifactId>
      <version>12.0.0</version>
    </dependency>`
    : ""
}
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
    </dependency>
  </dependencies>

  <build>
    <plugins>
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
      </plugin>
    </plugins>
  </build>
</project>`,

    "src/main/resources/application.properties": `server.port=8080
spring.application.name=${baseName}`,

    "src/main/java/com/example/demo/DemoApplication.java": `package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {
  public static void main(String[] args) {
    SpringApplication.run(DemoApplication.class, args);
  }
}`,

    ...(isGraphQL
      ? {
          "src/main/java/com/example/demo/graphql/GraphQLController.java": `package com.example.demo.graphql;

import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

@Controller
public class GraphQLController {

  @QueryMapping
  public String hello() {
    return "Hello from GraphQL";
  }
}
`,
        }
      : {
          "src/main/java/com/example/demo/controller/HealthController.java": `package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
public class HealthController {

  @GetMapping("/api/health")
  public Map<String, Object> health() {
    return Map.of(
        "status", "UP",
        "timestamp", Instant.now().toString()
    );
  }
}`,
        }),

    ...(needTestFiles
      ? {
          "src/test/java/com/example/demo/DemoApplicationTests.java": `package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class DemoApplicationTests {

  @Test
  void contextLoads() {
  }
}
`,
          ...(isGraphQL
            ? {
                "src/test/java/com/example/demo/graphql/GraphQLControllerTest.java": `package com.example.demo.graphql;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class GraphQLControllerTest {

  @Test
  void helloShouldReturnMessage() {
    GraphQLController controller = new GraphQLController();
    assertEquals("Hello from GraphQL", controller.hello());
  }
}
`,
              }
            : {
                "src/test/java/com/example/demo/controller/HealthControllerTest.java": `package com.example.demo.controller;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(HealthController.class)
class HealthControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Test
  void testHealth() throws Exception {
    mockMvc.perform(get("/api/health"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.status").value("UP"));
  }
}
`,
              }),
        }
      : {}),
  };

  return { files };
};

export default Java;
