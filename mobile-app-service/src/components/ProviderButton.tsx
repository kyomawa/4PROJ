import { Text, TouchableOpacity, View, Image } from "react-native";

// ========================================================================================================

type ProviderButtonProps = {
  title: string;
  iconSrc: any;
  handlePress: () => void;
};

export default function ProviderButton({ title, iconSrc, handlePress }: ProviderButtonProps) {
  return (
    <TouchableOpacity
      className="relative items-center justify-center h-16 bg-white border rounded-full md:h-24 border-neutral-200 hover:bg-black"
      activeOpacity={0.55}
      onPress={handlePress}
    >
      <View className="flex-row items-center gap-x-2.5">
        <Image
          className="w-[22px] h-[22px] xs:w-7 xs:h-7 md:w-10 md:h-10"
          style={{ resizeMode: "contain" }}
          source={iconSrc}
        />
        <Text className="text-xl text-black font-Satoshi-Bold md:mt-2">{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ========================================================================================================
