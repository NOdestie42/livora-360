import React, { useEffect, useState } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import CustomInput from "../CustomInput";
import CustomButton from "../CustomButton";
import { SignUpComProps } from "@/types";
import FinishingSignUp from "../FinisgingSignup/SignUpTopComp";
import Toast from "react-native-toast-message";

const DOB = ({ userInfo, onNext, setStep }: SignUpComProps) => {
  const [date, setDate] = useState<Date>(
    userInfo.birthday ? userInfo.birthday : new Date()
  );
  const [show, setShow] = useState<boolean>(false);
  const [error, setError] = useState("");

  const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleNext = () => {
    const age = calculateAge(date);

    if (age < 18) {
      setError("You must be at least 18 years old to sign up.");
      return;
    }
    setError("");

    setStep((prev) => prev + 1);
    onNext({ birthday: date });
  };

  useEffect(() => {
    if (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error,
      });

      setError("");
    }
  }, [error]);
  const onChange = (event: DateTimePickerEvent, selectedDate?: Date): void => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };

  const showDatepicker = (): void => {
    setShow(true);
  };

  return (
    <View>
      <FinishingSignUp setStep={setStep} />

      <View className="flex items-center gap-8 mt-8">
        <Pressable onPress={showDatepicker} className="w-full justify-center">
          <View pointerEvents="none">
            <CustomInput
              placeholder="Birthday"
              value={date.toLocaleDateString()}
              editable={false}
            />
          </View>
        </Pressable>
        <Text className="text-sm text-textSecondary px-1 mt-1">
          To sign up, you need to be at least 18. Your Birthday won't be shared
          with other people who use Viste.
        </Text>
        <CustomButton text="Next" onPress={handleNext} />
      </View>
      {show && (
        <DateTimePicker
          mode="date"
          display="spinner"
          value={date}
          onChange={onChange}
        />
      )}
    </View>
  );
};

export default DOB;
