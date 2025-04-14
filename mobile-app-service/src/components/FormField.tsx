import { icons } from "lucide-react-native";
import { forwardRef, useState } from "react";
import { Controller } from "react-hook-form";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Icon from "./Icon";

type FormFieldProps = {
  name: string;
  label: string;
  icon?: keyof typeof icons;
  placeholder: string;
  passwordField?: boolean;
  control: any;
} & TextInputProps;

const FormField = forwardRef<TextInput, FormFieldProps>(
  ({ control, name, icon, label, placeholder, passwordField = false, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(passwordField);

    return (
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
          <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={150}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View className="space-y-2 md:space-y-3">
                <View className="w-full flex flex-col gap-y-1.5">
                  <Text className="text-lg">{label}</Text>
                  <View className="relative flex flex-row items-center justify-start border rounded-full bg-neutral-100 border-neutral-100 focus:border-primary-500">
                    {icon && <Icon name={icon} className="ml-4 text-neutral-400 size-7" />}
                    <TextInput
                      ref={ref}
                      className={`p-4 rounded-full flex-1 placeholder:text-neutral-400 `}
                      value={value}
                      cursorColor="#5a3dee"
                      selectionColor="#7c7aff"
                      onBlur={onBlur}
                      secureTextEntry={showPassword}
                      onChangeText={onChange}
                      placeholder={placeholder}
                      {...props}
                    />
                    {passwordField && (
                      <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="mr-4">
                        {showPassword ? (
                          <Icon name="Eye" className="text-neutral-400 size-7" />
                        ) : (
                          <Icon name="EyeOff" className="text-neutral-400 size-7" />
                        )}
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                {error && (
                  <Text className="text-base text-red-500 font-sregular xs:text-lg md:text-2xl">{error.message}</Text>
                )}
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        )}
      />
    );
  }
);

export default FormField;
