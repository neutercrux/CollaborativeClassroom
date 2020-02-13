export interface ITheme {
    name: string,
    actual_name: string,
}

export const THEMES: ITheme[] = [
    { name: "Clouds Midnight", actual_name: "ace/theme/clouds_midnight" },
    { name: "Github", actual_name: "ace/theme/github" }
]