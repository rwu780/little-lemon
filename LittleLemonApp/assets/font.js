import { StyleSheet } from "react-native";

const weight = {
    Regular: '400',
    Medium: '500',
    SemiBold: '600',
    Bold: '700',
    ExtraBold: '800'
}

export default StyleSheet.create({
    titleText: {
        fontSize: 50,
        fontWeight: weight.Medium
    },
    subTitleText: {
        fontSize: 40,
        fontWeight: weight.Medium
    },
    ctaText: {
        fontSize: 18,
        fontWeight: weight.Medium
    },
    headingText: {
        fontSize: 24,
        fontWeight: weight.SemiBold,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: weight.ExtraBold,
        textTransform: 'uppercase'
    },
    sectionCategories: {
        fontSize: 16,
        fontWeight: weight.ExtraBold
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    paragraphText: {
        fontSize: 18,
    },
    highlightText: {
        fontWeight: 16,
        fontWeight: weight.Medium
    }


})