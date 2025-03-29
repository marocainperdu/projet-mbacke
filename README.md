# 🚀 Instructions de Déploiement

## 1️⃣ Cloner le projet
```sh
git clone https://github.com/marocainperdu/projet-mbacke.git
cd projet-mbacke
```

## 2️⃣ Modification du fichier `docker-compose.yml`
Avant de démarrer les conteneurs, modifiez le fichier `docker-compose.yml` en fonction de votre environnement :

```yaml
services:
  frontend:
    build:
      context: ./front-end
      dockerfile: Dockerfile
    ports:
      - "36374:80"
    depends_on:
      - backend

  backend:
    build:
      context: ./back-end
      dockerfile: Dockerfile
      args:
        DB_HOST: ${DB_HOST}
        DB_USER: ${DB_USER}
        DB_PASSWORD: ${DB_PASSWORD}
        DB_NAME: ${DB_NAME}
        GROQ_API_KEY: ${GROQ_API_KEY}
    ports:
      - "3015:3000"
    environment:
      - DB_HOST="URL de la base de données"
      - DB_USER="Nom d'utilisateur de la base de données"
      - DB_PASSWORD="Mot de passe de la base de données"
      - DB_NAME="Nom de la base de données"
      - GROQ_API_KEY="Clé API de Groq pour l'IA"
    volumes:
      - ./back-end/uploads:/app/uploads
```

## 3️⃣ Modification du fichier `config.js.template`
Mettez à jour `config.js.template` avec les informations appropriées :

```js
const config = {
  apiEndpoint: "URL de l'endpoint Appwrite",
  projectId: "Project ID de Appwrite",
  apiUrl: "URL du back-end"
};
export default config;
```

## 4️⃣ Construction et démarrage des conteneurs
```sh
docker-compose build
docker-compose up -d
```

## ✅ Vérifications post-déploiement
- Assurez-vous que les services sont bien lancés :
  ```sh
  docker ps
  ```
- Testez l'accès au back-end et au front-end dans votre navigateur.
- Consultez les logs en cas de problème :
  ```sh
  docker-compose logs -f
  ```

Si vous constatez un oubli ou un problème, merci de le signaler ! 🚀

