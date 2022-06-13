import React from "react";

import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { amber, grey } from '@mui/material/colors';

const getDesignTokens = (mode) => ({
    palette: {
        mode,
        primary: {
            ...(mode === 'light' ?
                {
                    main: '#F26155',
                }
                :
                {
                    main: "#000000"
                }
            ),
        },
        secondary: {
            ...(mode === 'light' ? {
                main: '#ffffff'
            } : {
                main: '#000000'
            }),
        },
        ...(mode === 'light' ? {
            background: {
                default: '#ffffff',
                paper: '#ffffff',
            },
        } : {
            background: {
                default: '#ffffff',
                paper: '#ffffff',
            },
        }),
        text: {
            ...(mode === 'light'
                ? {
                    primary: '#000000',
                    secondary: '#000000',
                }
                : {
                    primary: '#FFFFFF',
                    secondary: '#000000',
                }),
        },

    },
});
// ** Declare Theme Provider
const MaterialThemeProvider = ({ children }) => {

    const darkTheme = createTheme(getDesignTokens('light'));
    return (
        <ThemeProvider theme={darkTheme}>
            {children}
        </ThemeProvider>
    );
};

export default MaterialThemeProvider;