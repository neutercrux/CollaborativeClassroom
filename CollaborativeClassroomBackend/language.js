function Language(lang, version, index) {
    this.lang = lang;
    this.version = version;
    this.index = index;
}
let myLangMap = new Map();
var langDetails = new Language('java','JDK 9.0.1','1');
var lang = 'java';
myLangMap.set(lang,langDetails);

langDetails = new Language('cpp14','g++ 14 GCC 9.1.0','3');
lang = 'c_cpp';
myLangMap.set(lang,langDetails);

langDetails = new Language('python3', '3.6.5','2');
lang = 'python';
myLangMap.set(lang,langDetails);

langDetails = new Language('csharp','mono 5.10.1','2');
lang = 'csharp';
myLangMap.set(lang,langDetails);

langDetails = new Language('ruby','2.2.4','0');
lang = 'ruby';
myLangMap.set(lang,langDetails);

langDetails = new Language('php','5.6.16','0');
lang = 'php';
myLangMap.set(lang,langDetails);

module.exports = myLangMap;