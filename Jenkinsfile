pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/your-username/your-repo.git', branch: 'main'
            }
        }

        stage('Unzip docker-compose') {
            steps {
                sh 'unzip -o docker-compose.zip'
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                sh '''
                    docker-compose -f ${DOCKER_COMPOSE_FILE} down || true
                    docker-compose -f ${DOCKER_COMPOSE_FILE} up -d --build
                '''
            }
        }
    }

    post {
        always {
            echo 'Cleaning up...'
            sh 'docker-compose down || true'
        }
    }
}
