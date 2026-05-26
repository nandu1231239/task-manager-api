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
        stage('Code Quality - SonarQube') {
    steps {
        echo 'Running SonarCloud analysis...'
        script {
            // 1. Fetch the absolute installation path from Jenkins Tool Configuration
            // 'SonarQube' matches the exact name from your Tools screen
            def scannerHomePath = tool 'SonarQube'
            
            // 2. Wrap your execution with the environment injector
            withSonarQubeEnv('SonarQube') {
                // 3. Execute using the explicit path to the binary folder
                sh """
                    ${scannerHomePath}/bin/sonar-scanner \
                    -Dsonar.organization=nandu1231239 \
                    -Dsonar.projectKey=nandu1231239_task-manager-api \
                    -Dsonar.sources=src \
                    -Dsonar.host.url=https://sonarcloud.io
                """
            }
        }
    }
}

        

        stage('Security Scan - Snyk') {
            environment {
                SNYK_TOKEN = credentials('snyk-api-token')
            }

            steps {
                echo 'Installing Snyk CLI...'
                sh 'npm install -g snyk'

                echo 'Authenticating with Snyk...'
                sh 'snyk auth $SNYK_TOKEN'

                echo 'Running vulnerability scan...'
                sh 'snyk test --severity-threshold=high'

                echo 'Sending results to Snyk dashboard...'
                sh 'snyk monitor || true'
            }
        }

        stage('Deploy to Staging') {
            steps {
                echo "Deploying to staging on port $STAGING_PORT..."

                sh '''
                    docker stop api-staging || true
                    docker rm api-staging || true
                    docker run -d -p $STAGING_PORT:5000 --name api-staging $DOCKER_IMAGE
                '''

                sh 'sleep 10'
                sh "curl -f http://localhost:$STAGING_PORT/health || exit 1"
            }
        }

        stage('Release to Production') {
            steps {
                echo "Deploying to production on port $PROD_PORT..."

                sh '''
                    docker stop api-prod || true
                    docker rm api-prod || true
                    docker run -d -p $PROD_PORT:5000 --name api-prod $DOCKER_IMAGE
                '''

                sh 'sleep 10'
                sh "curl -f http://localhost:$PROD_PORT/health || exit 1"
            }
        }

        stage('Monitoring & Alerts') {
            steps {
                echo 'Checking production health...'
                sh "curl -f http://localhost:$PROD_PORT/health || exit 1"

                echo 'Monitoring integration simulated'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }

        failure {
            mail to: 'nandakishore9t@example.com',
                 subject: "Pipeline Failed: ${currentBuild.fullDisplayName}",
                 body: "Check Jenkins logs: ${env.BUILD_URL}"
        }
    }
}
