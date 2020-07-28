export interface ILanguage {
    name: string,
    ext: string,
    comment_syntax: string
}

export const LANGUAGES: ILanguage[] = [
    { name: "c_cpp", ext: "cpp", comment_syntax: "//" },
    { name: "java", ext: "java", comment_syntax: "//" },
    { name: "python", ext: "py", comment_syntax: "#" },
    { name: "csharp", ext: "cs", comment_syntax: "//" },
    { name: "ruby", ext: "rb", comment_syntax: "#" },
    { name: "nodejs", ext: "js", comment_syntax: "//"}
]