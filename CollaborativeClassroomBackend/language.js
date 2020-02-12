function Language(lang, name, version, index) {
    this.lang = lang;
    this.name = name;
    this.version = version;
    this.index = index;
}
let myLangMap = new Map();
var langDetails = new Language('java','Java','JDK 9.0.1','1');
var lang = 'java';
myLangMap.set(lang,langDetails);

langDetails = new Language('nodejs','NodaJS','9.2.0','1');
lang = 'nodejs';
myLangMap.set(lang,langDetails);

langDetails = new Language('python3','Python 3','3.6.5','2');
lang = 'python3';
myLangMap.set(lang,langDetails);

langDetails = new Language('csharp','C#','mono 5.10.1','2');
lang = 'csharp';
myLangMap.set(lang,langDetails);

langDetails = new Language('ruby','Ruby','2.2.4','0');
lang = 'ruby';
myLangMap.set(lang,langDetails);

langDetails = new Language('php','PHP','5.6.16','0');
lang = 'php';
myLangMap.set(lang,langDetails);

module.exports = myLangMap;