import { PropsWithChildren, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ChevronRightIcon } from "lucide-react-native";

import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";

export function Collapsible({
  children,
  title,
}: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View>
      <Pressable
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        className="active:opacity-70"
      >
        <View
          style={{
            transform: [{ rotate: isOpen ? "90deg" : "0deg" }],
          }}
        >
          <Icon
            as={ChevronRightIcon}
            size="sm"
            className="text-typography-500 dark:text-typography-400"
          />
        </View>
        <Text className="font-semibold text-typography-900 dark:text-typography-100">
          {title}
        </Text>
      </Pressable>
      {isOpen && (
        <View style={styles.content}>{children}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
  },
});
