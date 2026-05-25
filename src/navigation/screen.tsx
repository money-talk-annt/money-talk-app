import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTab } from './bottom';
import { THEME } from '../theme';

const RootStack = createNativeStackNavigator({
    screens: {
        Dashboard: {
            screen: BottomTab,
            options: {
                headerShown: true,
                headerTitle: 'Money Talk',
                headerTintColor: THEME.colors.primary
            },
        },

    }
});

export {RootStack}