type Theme = {
	bgColor: string;
	mainColor: string;
	subColor: string;
};

export const updateTheme = (theme: Theme) => {
	document.documentElement.style.setProperty('--bg-color', theme.bgColor);
	document.documentElement.style.setProperty('--main-color', theme.mainColor);
	document.documentElement.style.setProperty('--sub-color', theme.subColor);
};
