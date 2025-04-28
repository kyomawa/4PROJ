import { Text, TouchableOpacity } from "react-native";

// ========================================================================================================

type ButtonProps = {
  children: string;
  handlePress?: () => void;
  containerClassName?: string;
  textClassName?: string;
  isLoading?: boolean;
};

// ========================================================================================================

export default function Button({ children, handlePress, containerClassName, textClassName, isLoading }: ButtonProps) {
  return (
    <TouchableOpacity
      className={`w-full md:w-[515px] h-16 justify-center items-center bg-primary-500 rounded-full md:h-24 d relative ${containerClassName} ${
        isLoading && "opacity-50"
      }`}
      disabled={isLoading}
      onPress={handlePress}
      activeOpacity={0.75}
    >
      <Text className={`text-white absolute z-[1] font-Satoshi-Bold text-[1.35rem] md:text-3xl ${textClassName}`}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

// ========================================================================================================
