# Stage 1: Compilazione del file JAR usando Gradle e Java 21
FROM gradle:8-jdk21 AS build
WORKDIR /app
COPY . .
# Compila il progetto saltando i test per velocizzare la build di Docker
RUN ./gradlew clean bootJar --no-daemon

# Stage 2: Esecuzione dell'applicazione con un runtime leggero di Java 21
FROM openjdk:21-slim
WORKDIR /app
# Copia il file .jar generato dallo stage precedente
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
# Avvia l'applicazione in modalità produzione
ENTRYPOINT ["java", "-jar", "app.jar"]