pipeline {
    agent any
     tools {
        // This must match the exact Name from your Tools page
        sonarScanner 'SonarQube' 
    }

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
                // Matches the Name from your "System" configuration screen
                withSonarQubeEnv('SonarQube') {
                    sh '''
                        sonar-scanner \
                        -Dsonar.organization=nandu1231239 \
                        -Dsonar.projectKey=nandu1231239_task-manager-api \
                        -Dsonar.sources=.src \
                        -Dsonar.host.url=https://sonarcloud.io
                    '''
                }
            }
        }
        

stage('Snyk Security Scan') {

    steps {

        withCredentials([
            string(
                credentialsId: '668ef189-04f8-45ec-ac5a-66a02cf66158',
                variable: 'SNYK_TOKEN'
            )
        ]) {

            sh 'snyk auth $SNYK_TOKEN'

            sh 'npm run snyk-test'

            sh 'npm run snyk-monitor'
        }
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
