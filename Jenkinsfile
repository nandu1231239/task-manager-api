pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "myapi:latest"
        STAGING_PORT = "5001"
        PROD_PORT = "5000"
    }

    stages {
        stage('Build') {
            steps {
                echo 'Installing dependencies...'
                sh 'npm install'
                
                echo 'Building Docker image...'
                sh 'docker build -t $DOCKER_IMAGE .'
            }
        }

        stage('Test') {
            steps {
                echo 'Running automated tests...'
                sh 'npm test'
            }
        }

        stage('Code Quality') {
            steps {
                echo 'Running SonarQube code quality analysis...'
                withSonarQubeEnv('SonarQube') {
                    sh 'sonar-scanner'
                }
            }
        }

        stage('Security Scan') {
            steps {
                echo 'Running security scan with Snyk...'
                sh 'snyk test --fail-on=all || true'
            }
        }

        stage('Deploy to Staging') {
            steps {
                echo "Deploying Docker container to staging on port $STAGING_PORT..."
                sh """
                    docker stop api-staging || true
                    docker rm api-staging || true
                    docker run -d -p $STAGING_PORT:5000 --name api-staging $DOCKER_IMAGE
                """
                sh 'sleep 10'
                sh "curl -f http://localhost:$STAGING_PORT/health || exit 1"
            }
        }

        stage('Release to Production') {
            steps {
                echo "Promoting container to production on port $PROD_PORT..."
                sh """
                    docker stop api-prod || true
                    docker rm api-prod || true
                    docker run -d -p $PROD_PORT:5000 --name api-prod $DOCKER_IMAGE
                """
                sh 'sleep 10'
                sh "curl -f http://localhost:$PROD_PORT/health || exit 1"
            }
        }

        stage('Monitoring & Alerts') {
            steps {
                echo 'Checking production health...'
                sh "curl -f http://localhost:$PROD_PORT/health || exit 1"
            }
        }
    }

    post {
        failure {
            mail to: 'nandakishore9t@example.com',
                 subject: "Pipeline Failed: ${currentBuild.fullDisplayName}",
                 body: "Check Jenkins logs: ${env.BUILD_URL}"
        }
        success {
            echo 'Pipeline completed successfully!'
        }
    }
}