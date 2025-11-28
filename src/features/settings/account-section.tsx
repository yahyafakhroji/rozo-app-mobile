import { ChevronRightIcon } from "lucide-react-native";
import React, { useRef } from "react";

import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import {
  ProfileSheet,
  type ProfileSheetRefType,
} from "@/features/settings/profile-sheet";
import { useApp } from "@/providers/app.provider";

export function AccountSection() {
  const { merchant } = useApp();
  const profileSheetRef = useRef<ProfileSheetRefType>(null);

  return (
    <VStack space="sm" className="w-full">
      <Pressable
        onPress={() => profileSheetRef.current?.open()}
        className="flex flex-row items-center justify-between"
      >
        <HStack space="sm" className="items-center">
          <Avatar className="mr-2" size="sm">
            <AvatarFallbackText>
              {merchant?.display_name?.slice(0, 2) || "-"}
            </AvatarFallbackText>
            <AvatarImage
              source={{
                uri: merchant?.logo_url || undefined,
              }}
              alt="image"
            />
          </Avatar>
          <VStack>
            <Heading size="sm" className="text-typography-900 dark:text-typography-100">
              {merchant?.display_name ?? "-"}
            </Heading>
            <Text
              size="xs"
              className="text-typography-500 dark:text-typography-400"
            >
              {merchant?.display_name !== merchant?.email
                ? (merchant?.email ?? "-")
                : "-"}
            </Text>
          </VStack>
        </HStack>
        <Icon
          as={ChevronRightIcon}
          className="text-typography-400 dark:text-typography-500"
        />
      </Pressable>

      <ProfileSheet ref={profileSheetRef} />
    </VStack>
  );
}
