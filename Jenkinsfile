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

        stage('Snyk Security Scan') {
            steps {
                withCredentials([string(credentialsId: 'snyk-token', variable: 'SNYK_TOKEN')]) {
                    sh '''
                        echo "Running Snyk test..."
                        snyk test --all-projects --severity-threshold=high --token=$SNYK_TOKEN

                        echo "Running Snyk monitor..."
                        snyk monitor --all-projects --token=$SNYK_TOKEN
                    '''
                }
            }
        }



stage('Deploy to Staging') {
    steps {
        sh '''
            echo "Deploying application..."

            docker stop api-staging || true
            docker rm api-staging || true

            docker run -d \
              -p 5001:5000 \
              -e PORT=5000 \
              -e MONGO_URI=mongodb://host.docker.internal:27017/taskmanager \
              -e JWT_SECRET=assignment \
              --name api-staging \
              myapi:latest
        '''
    }
}
        stage('Release to Production') {
    steps {
        sh '''
            echo "Deploying to production on port 5002..."

            docker stop api-prod || true
            docker rm api-prod || true

            docker run -d \
              -p 5002:5000 \
              -e PORT=5000 \
              -e MONGO_URI=mongodb://host.docker.internal:27017/taskmanager \
              -e JWT_SECRET=assignment \
              --name api-prod \
              myapi:latest
        '''
    }
}

  stage('Monitoring') {
    steps {

        echo 'Checking Application Metrics'

        sh 'curl --fail http://host.docker.internal:5000/metrics'

        echo 'Checking Prometheus Health'

        sh 'curl --fail http://host.docker.internal:9090/-/healthy'

        echo 'Checking Grafana Health'

        sh 'curl --fail http://host.docker.internal:3000/api/health'

        echo 'Monitoring Verification Successful'
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
