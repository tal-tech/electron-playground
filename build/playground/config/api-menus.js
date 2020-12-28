const path = require('path');
const fs = require('fs');

// 找到apidoc下所有的markdown文件
const apidoc_path = path.resolve(__dirname,'..','..','..','playground', 'apidocs')
const menus = []

function findMarkdowns(dirPath, parentChildrenFolder) {
  if (!fs.statSync(dirPath).isDirectory()) return
  const files = fs.readdirSync(dirPath)
  files.forEach(f => {
    const fullPath = path.join(dirPath, f)
    if(['img', 'components'].includes(f)) return
    if (fs.statSync(fullPath).isFile() && path.extname(fullPath) === '.md') {
      parentChildrenFolder.push({filePath: fullPath, title: f.replace(/.md$/, '')})
      return
    }
    if (fs.statSync(fullPath).isDirectory()) {
      const folder = {title: f, children: [], filePath: fullPath}
      parentChildrenFolder.push(folder)
      findMarkdowns(fullPath, folder.children)
    }
  })
}

findMarkdowns(apidoc_path, menus)

module.exports = menus