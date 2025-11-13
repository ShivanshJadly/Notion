pipeline {
    agent any

    stages {
        stage('Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/ShivanshJadly/Notion.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build') {
            when {
                expression { fileExists('package.json') && sh(returnStdout: true, script: "jq '.scripts.build' package.json") }
            }
            steps {
                sh 'npm run build || true'
            }
        }

        stage('Deploy to Dev') {
            steps {
                sh '''
                rm -rf /var/www/app-dev/*
                cp -r * /var/www/app-dev/

                pm2 delete dev || true
                pm2 start /var/www/app-dev/index.js --name dev -- 3000
                '''
            }
        }

        stage('Approval for QA') {
            steps {
                input message: "Promote to QA?"
            }
        }

        stage('Deploy to QA') {
            steps {
                sh '''
                rm -rf /var/www/app-qa/*
                cp -r * /var/www/app-qa/

                pm2 delete qa || true
                pm2 start /var/www/app-qa/index.js --name qa -- 4000
                '''
            }
        }
    }
}


