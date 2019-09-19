pipeline {
  agent any
  stages {
    stage('Build docker container') {
      steps {
        sh 'docker build -t mynode:$BUILD_NUMBER .'
      }
    }
    stage('Push to local registry') {
      steps {
        sh 'docker tag mynode:$BUILD_NUMBER devnode:5000/mynode'
        sh 'docker push devnode:5000/mynode'
      }
    }
    stage('Apply deployment changes') {
      steps {
        sh 'kubectl apply -f kubernetes/cncfdemo.yml'
      }
    }
    stage('Deploy new image to kubernetes') {
      steps {
        sh 'kubectl rolling-update cncfdemo --image devnode:5000/mynode --image-pull-policy Always'
      }
    }
    stage('Done') {
      steps {
        sh 'echo "Finished"'
      }
    }
  }
}
