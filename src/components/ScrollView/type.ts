import { ScrollViewProps } from "react-native";
import { KeyboardAwareScrollViewProps } from "react-native-keyboard-aware-scroll-view";

export interface ScrollViewCTProps  extends ScrollViewProps, KeyboardAwareScrollViewProps{
    isScreen?: boolean
    isKeyboardAwareScrollView?:boolean
} 