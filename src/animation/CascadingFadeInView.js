import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';

const CascadingFadeInView = ({ children, delay = 0, style, animationKey }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const yPosition = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        fadeAnim.setValue(0);
        yPosition.setValue(5);

        const timer = setTimeout(() => {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(yPosition, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }, delay);

        return () => clearTimeout(timer);
    }, [animationKey]);

    return (
        <Animated.View
            style={[
                style,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: yPosition }],
                },
            ]}
        >
            {children}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
});

export default CascadingFadeInView;

// import Cascading from '../animation/CascadingFadeInView';
// import { useFocusEffect } from '@react-navigation/native';


    // const [animationKey, setAnimationKey] = useState(Date.now());
    // useFocusEffect(
    // useCallback(() => {
    //     setAnimationKey(Date.now());
    // }, [])
    // );

{/* <Cascading delay={100} animationKey={animationKey}>
</Cascading> */}