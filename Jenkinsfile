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
//        /
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
