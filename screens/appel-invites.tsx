import { Marquee } from '@animatereactnative/marquee';
import { Stagger } from '@animatereactnative/stagger';
import React, { useEffect, useState } from 'react'
import { Dimensions, Image, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeInUp, FadeOut, useAnimatedReaction, useSharedValue, Easing } from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets';

const AppelInvites = () => {

    const { width } = Dimensions.get('window');
    const { height } = Dimensions.get('window');
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const images = [
        "https://wstatic-prod.pubg.com/web/live/main_6b7e058/img/63efb4d.webp",
        "https://wstatic-prod.pubg.com/web/live/main_6b7e058/img/3b364a2.webp",
        "https://wstatic-prod.pubg.com/web/live/main_6b7e058/img/9606298.webp",
        "https://wstatic-prod.pubg.com/web/live/main_6b7e058/img/f32020b.webp",
        "https://wstatic-prod.pubg.com/web/live/main_6b7e058/img/a06512f.webp"

    ]

    const _ItemWidth = width * 0.62;
    const _ItemHeight = height * 0.42;
    const _Spacing = 16;

    const Item = ({ image }: { image: string, key: string }) => {
        return <View
            style={
                {
                    width: _ItemWidth,
                    height: _ItemHeight,
                    borderRadius: 16,
                    overflow: 'hidden',
                    backgroundColor: 'white',
                    elevation: 4,

                }
            }
        >
            <Image
                src={image}
                style={{ flex: 1, objectFit: 'cover' }}
            />
        </View>
    }

    const _offset = useSharedValue(0);

    useAnimatedReaction(
        () => {
            "worklet";
            const index = Math.abs(Math.round(_offset.value / (_ItemWidth + _Spacing))) % images.length;
            return index;
        },
        (value) => {
            "worklet";

            scheduleOnRN(setActiveIndex, value);
        }
    );
    // Prefetch the current image (or next one)
    useEffect(() => {
        Image.prefetch(images[activeIndex])
            .then(() => console.log("Prefetched:", images[activeIndex]))
            .catch((err) => console.log("Prefetch Error:", err));
    }, [activeIndex]);
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
            <View style={[StyleSheet.absoluteFill]}>
                <Animated.Image
                    key={`image-${activeIndex}`}
                    style={[{ flex: 1 }]}
                    src={images[activeIndex]}
                    blurRadius={50}
                    entering={FadeIn.duration(1000)}
                    exiting={FadeOut.duration(1000)}
                />
            </View>
            <Marquee spacing={_Spacing} speed={1} position={_offset}>
                <Animated.View style={{ flexDirection: 'row', gap: _Spacing }}
                    entering={FadeInUp.delay(500).duration(1000).easing(Easing.elastic(0.9)).withInitialValues({
                        transform: [{ translateY: -_ItemHeight / 2 }]
                    })}
                >
                    {
                        images.map((image, index) => (
                            <Item key={`item-${index}`} image={image} />
                        ))
                    }
                </Animated.View>
            </Marquee>

            <Stagger
                initialEnteringDelay={1000}
                duration={500}
                stagger={100}
                style={{
                    flex: 0.5,
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <Text style={{ color: 'white', fontSize: 24, marginTop: 40, fontWeight: 'bold' }}

                >
                    Welcome to PUBG Mobile
                </Text>
                <Text style={{ color: 'white', fontSize: 16, marginTop: 10, maxWidth: width * 0.8, textAlign: 'center' }}

                >
                    Experience the ultimate battle royale game with stunning graphics, intense gameplay, and endless fun. Join millions of players worldwide and prove your skills on the battlefield!
                </Text>
            </Stagger>
        </View>
    )
}

export default AppelInvites