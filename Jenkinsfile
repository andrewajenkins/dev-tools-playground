pipeline {
    agent any
    
    environment {
        DB_HOST = 'localhost'
        DB_NAME = 'qa_sandbox'
        DB_USER = 'qa_user'
        DB_PASSWORD = 'qa_password'
        DB_PORT = '5432'
        NODE_VERSION = '18'
        PYTHON_VERSION = '3.9'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo "🔄 Checking out QA Sandbox repository"
            }
        }
        
        stage('Setup Environment') {
            parallel {
                stage('Setup Node.js') {
                    steps {
                        sh '''
                            echo "📦 Setting up Node.js ${NODE_VERSION}"
                            node --version
                            npm --version
                        '''
                    }
                }
                stage('Setup Python') {
                    steps {
                        sh '''
                            echo "🐍 Setting up Python ${PYTHON_VERSION}"
                            python3 --version
                            pip3 --version
                        '''
                    }
                }
                stage('Setup Database') {
                    steps {
                        sh '''
                            echo "🗄️ Setting up PostgreSQL"
                            docker run --name qa-postgres -d \
                                -e POSTGRES_DB=${DB_NAME} \
                                -e POSTGRES_USER=${DB_USER} \
                                -e POSTGRES_PASSWORD=${DB_PASSWORD} \
                                -p 5432:5432 \
                                postgres:14
                            sleep 10
                        '''
                    }
                }
            }
        }
        
        stage('Install Dependencies') {
            parallel {
                stage('Backend Dependencies') {
                    steps {
                        dir('backend') {
                            sh '''
                                echo "🔧 Installing Python dependencies"
                                pip3 install -r requirements.txt
                            '''
                        }
                    }
                }
                stage('Frontend Dependencies') {
                    steps {
                        dir('frontend') {
                            sh '''
                                echo "🎨 Installing Angular dependencies"
                                npm ci
                            '''
                        }
                    }
                }
                stage('E2E Test Dependencies') {
                    steps {
                        dir('tests-e2e') {
                            sh '''
                                echo "🧪 Installing E2E test dependencies"
                                npm ci
                            '''
                        }
                    }
                }
            }
        }
        
        stage('Database Setup') {
            steps {
                dir('backend') {
                    sh '''
                        echo "🏗️ Setting up database"
                        python3 manage.py migrate
                        python3 manage.py seed_data
                    '''
                }
            }
        }
        
        stage('Build') {
            parallel {
                stage('Build Frontend') {
                    steps {
                        dir('frontend') {
                            sh '''
                                echo "🔨 Building Angular frontend"
                                npm run build --prod
                            '''
                        }
                    }
                }
                stage('Build Backend') {
                    steps {
                        dir('backend') {
                            sh '''
                                echo "🔨 Collecting Django static files"
                                python3 manage.py collectstatic --noinput
                            '''
                        }
                    }
                }
            }
        }
        
        stage('Start Services') {
            parallel {
                stage('Start Backend') {
                    steps {
                        dir('backend') {
                            sh '''
                                echo "🚀 Starting Django backend"
                                python3 manage.py runserver 0.0.0.0:8000 &
                                sleep 10
                            '''
                        }
                    }
                }
                stage('Start Frontend') {
                    steps {
                        dir('frontend') {
                            sh '''
                                echo "🚀 Starting Angular frontend"
                                npm start &
                                sleep 15
                            '''
                        }
                    }
                }
            }
        }
        
        stage('Health Checks') {
            steps {
                sh '''
                    echo "🏥 Running health checks"
                    timeout 60 bash -c 'until curl -f http://localhost:8000/api/projects/; do sleep 2; done'
                    timeout 60 bash -c 'until curl -f http://localhost:4200; do sleep 2; done'
                    echo "✅ All services are healthy"
                '''
            }
        }
        
        stage('Run E2E Tests') {
            steps {
                dir('tests-e2e') {
                    sh '''
                        echo "🧪 Running E2E tests"
                        npm run test:headless
                    '''
                }
            }
            post {
                always {
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'tests-e2e/reports',
                        reportFiles: 'cucumber-report.html',
                        reportName: 'E2E Test Report'
                    ])
                    
                    archiveArtifacts artifacts: 'tests-e2e/reports/**/*', allowEmptyArchive: true
                }
                failure {
                    archiveArtifacts artifacts: 'tests-e2e/screenshots/**/*', allowEmptyArchive: true
                }
            }
        }
        
        stage('Docker Build') {
            when {
                branch 'main'
            }
            steps {
                sh '''
                    echo "🐳 Building Docker containers"
                    docker-compose up --build -d
                    sleep 30
                    docker-compose ps
                '''
            }
        }
        
        stage('Integration Tests') {
            when {
                branch 'main'
            }
            steps {
                sh '''
                    echo "🔗 Running integration tests"
                    timeout 60 bash -c 'until curl -f http://localhost:8000/api/projects/; do sleep 2; done'
                    timeout 60 bash -c 'until curl -f http://localhost:4200; do sleep 2; done'
                    echo "✅ Integration tests passed"
                '''
            }
        }
    }
    
    post {
        always {
            echo "🧹 Cleaning up"
            sh '''
                docker-compose down -v || true
                docker rm -f qa-postgres || true
                pkill -f "python3 manage.py runserver" || true
                pkill -f "ng serve" || true
            '''
        }
        success {
            echo "🎉 Pipeline completed successfully!"
        }
        failure {
            echo "❌ Pipeline failed!"
        }
    }
} 