import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState, memo, useCallback } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import CustomTabBar from "../CustomTabs";
import CustomIcon from "../../assets/galleryIcon.svg";
import Share from "../../assets/Share.svg";
import Message from "../../assets/SidebarMessage.svg";
import Booking from "../../assets/sidebarBook.svg";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchProperties } from "./request";
import { WebView } from "react-native-webview";
import Spinner from "../Spinner";
import Error from "../Error";
import SingleImpressiveProperty from "./SingleImpressiveProperty";
import { getItemFromAsyncStorage } from "@/AsyncStorage";

const { width, height } = Dimensions.get("window");

const ThreeDDetailsComp = memo(() => {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // ✅ This MUST be at top level
  const [storedUserId, setStoredUserId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [parentScrollEnabled, setParentScrollEnabled] = useState(true);

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await getItemFromAsyncStorage("userId");
      setStoredUserId(userId);
    };

    fetchUserId();
  }, []);

  const {
    data,
    isError,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["properties", id],
    queryFn: ({ pageParam = 1 }) => fetchProperties({ pageParam }, id),
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!id, // prevent query until id is defined
  });

  const flattenedData = data ? data.pages.flatMap((page) => page.data) : [];

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <View
        key={item.id || index}
        style={{ width, height, position: "relative" }}
      >
        <View
          style={{ flex: 1 }}
          onTouchStart={() => setParentScrollEnabled(false)}
          onTouchEnd={() => setParentScrollEnabled(true)}
          onTouchCancel={() => setParentScrollEnabled(true)}
        >
          <WebView
            style={{ flex: 1 }}
            source={{ uri: item.link || "https://example.com" }}
            startInLoadingState={true}
          />
        </View>

        <View
          style={{
            position: "absolute",
            right: 16,
            bottom: 100,
            alignItems: "center",
            gap: 20,
          }}
        >
          <SingleImpressiveProperty
            likedBy={item.likedBy}
            propertyId={item._id}
            storedUserId={storedUserId}
          />

          <TouchableOpacity
            onPress={() => router.push(`/3d-details/booking/${item._id}`)}
            className="flex items-center gap-2"
          >
            <Booking />
            <Text style={{ color: "white", textAlign: "center" }}>Booking</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex items-center gap-2">
            <Message />
            <Text style={{ color: "white", textAlign: "center" }}>Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex items-center gap-2">
            <Share />
            <Text style={{ color: "white", textAlign: "center" }}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const currentItemId = flattenedData[activeIndex]?._id;

  if (isLoading) return <Spinner />;
  if (isError) return <Error error={error} />;

  return (
    <>
      <FlatList
        data={flattenedData}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        scrollEnabled={parentScrollEnabled}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.8}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={3}
        removeClippedSubviews={true}
        getItemLayout={(data, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
        onScroll={(event) => {
          const offsetY = event.nativeEvent.contentOffset.y;
          const newIndex = Math.floor(offsetY / height);
          if (newIndex !== activeIndex) {
            setActiveIndex(newIndex);
          }
        }}
      />

      <CustomTabBar
        replaceTab={{
          label: "Media",
          icon: CustomIcon,
          route: `/threedmedia/${currentItemId}`,
          isActive: false,
        }}
        layoutClasses="bg-black/35 border-0"
      />
    </>
  );
});

ThreeDDetailsComp.displayName = "ThreeDDetailsComp";

export default ThreeDDetailsComp;
