const fs = require('fs')
const mime = require('mime-types')
import { getConfigValue } from './dal.js'
import _ from 'lodash'

//Tested
async function getFilePathUsingWorkId(file, workId) {
  var path = await getConfigValue('sharedPath')
  if (!path.endsWith('\\')) {
    path += '\\'
  }

  path += workId + '_' + file.size + file.lastModified + '.' + file.path.split('.').pop()
  return path
}

//Tested
export async function copyFile(file, workId){
  var path = await getFilePathUsingWorkId(file, workId)
  fs.copyFileSync(file.path, path)
  return path
}

//Tested
export function saveFile(file, path){
  var binaryArrays = convertFromBase64(file.content)
    var stream = fs.createWriteStream(path)
    for (var array of binaryArrays){
      stream.write(array)
    }
    stream.end()
}

//Tested
export async function deleteFile(fileContent){
  fs.unlinkSync(fileContent.path)
}

//Tested
export async function getFileList(workId) {
  var path = await getConfigValue('sharedPath')
  if (!path.endsWith('\\')) {
    path += '\\'
  }

  var files = fs.readdirSync(path)
  files = _.filter(files, (e) => {
    return e.startsWith(`${workId}_`)
  })

  var returnedValue = []
  for (var file of files) {
    returnedValue.push(path + file)
  }
  return returnedValue
}

//Tested
export function convertFromBase64(b64){
  var content = b64.replace(/data:image\/\w*;base64,/gm, '')
  return getByteArrays(atob(content))
}

//Tested
function getByteArrays(byteCharacters){
  var byteArrays = []
  var sliceSize = 1024

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize)

    var byteNumbers = new Array(slice.length)
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    var byteArray = new Uint8Array(byteNumbers)

    byteArrays.push(byteArray)
  }
  return byteArrays
}

//Tested
export async function turnFileIntoB64(fileName){
  // var path = await getConfigValue('sharedPath')
  // if (!path.endsWith('\\')) {
  //   path += '\\'
  // }
  var content = fs.readFileSync(fileName, 'binary')
  var y = getByteArrays(content)
  return new File(y, fileName, {type: mime.lookup(fileName)})

}