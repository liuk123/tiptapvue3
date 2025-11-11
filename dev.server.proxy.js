module.exports = {
  '/inms/emergency': {
    target: 'http://10.224.128.101:9088/',
    pathRewrite: {
      '^/inms': ''
    }
  },
  '/inms/jpmdata': {
    target: 'http://10.224.128.101:9088/',
    pathRewrite: {
      '^/inms': ''
    }
  },
  '/inms/arcgis': {
    target: 'http://10.4.149.61:6080/',
    pathRewrite: {
      '^/inms': ''
    }
  }
}
