# Stage 1: Compilazione con JDK 25
FROM gradle:jdk25 AS build
WORKDIR /app
COPY . .
RUN ./gradlew clean bootJar --no-daemon

# Stage 2: Esecuzione con JRE 25 (o JDK 25 se la JRE non è disponibile)
FROM eclipse-temurin:25-jre
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]