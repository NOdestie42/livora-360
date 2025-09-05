import React from 'react'
import YellowStar from '../../assets/yellowStar.svg';
import { Image, Text, View } from 'react-native'
import { useQuery } from '@tanstack/react-query';
import { singlepropertyreview } from './request';
import Spinner from '../Spinner';
import Error from '../Error';

const Review = ({ id }: { id: string }) => {

    const { isLoading, isError, data, error } = useQuery({
        queryKey: ["single-property-review",],
        queryFn: () => singlepropertyreview(id),
        enabled: !!id
    });

    const timeDifference = (date: string | Date) => {
        console.log({ date })
        const currentTime = new Date();
        console.log({ currentTime })
        const givenTime = new Date(date);
        console.log({ givenTime })
        const timeDiff = currentTime.getTime() - givenTime.getTime(); // Time difference in milliseconds

        // Convert time difference to seconds, minutes, hours, and days
        const diffInSeconds = Math.floor(timeDiff / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInSeconds < 60) {
            return `${diffInSeconds} seconds ago`;
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes} minutes ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours} hours ago`;
        } else {
            return `${diffInDays} days ago`;
        }
    };

    if (isLoading) return <Spinner />;
    if (isError) return <Error error={error} />;

    const starCount = {
        onestar: 0,
        twostar: 0,
        threestar: 0,
        fourstar: 0,
        fivestar: 0
    };


    data?.reviews.forEach((review) => {
        const stars = review.stars;

        if (stars === 1) starCount.onestar += 1;
        if (stars === 2) starCount.twostar += 1;
        if (stars === 3) starCount.threestar += 1;
        if (stars === 4) starCount.fourstar += 1;
        if (stars === 5) starCount.fivestar += 1;
    });

    const hasHalfStar = parseInt(data?.avgRating as string) % 1 !== 0;


    return (
        <View className='flex-1 bg-white'>
            {data &&
                <View className="w-[90%] mx-auto mt-6">
                    <Text className="text-[28px] font-semibold py-4">Rating & Reviews</Text>
                    <View className='flex flex-row gap-12 mb-6 border-b border-b-gray-200 pb-6'>
                        <View>
                            <View className='flex flex-row items-center gap-3 mb-4'>
                                <Text>5</Text>
                                <YellowStar />
                                <View className='relative w-52'>
                                    <View className='w-full h-4 bg-slate-100 rounded-md'></View>
                                    <View style={{ width: `${(starCount.fivestar / data.totalReviews) * 100}%` }} className={`h-4 bg-[#FFE066] rounded-md absolute top-0 left-0`}></View>
                                </View>
                            </View>

                            <View className='flex flex-row items-center gap-3 mb-4'>
                                <Text>4</Text>
                                <YellowStar />
                                <View className='relative w-52'>
                                    <View className='w-full h-4 bg-slate-100 rounded-md'></View>
                                    <View style={{ width: `${(starCount.fourstar / data.totalReviews) * 100}%` }} className={`h-4 bg-[#FFE066] rounded-md absolute top-0 left-0`}></View>
                                </View>
                            </View>

                            <View className='flex flex-row items-center gap-3 mb-4'>
                                <Text>3</Text>
                                <YellowStar />
                                <View className='relative w-52'>
                                    <View className='w-full h-4 bg-slate-100 rounded-md'></View>
                                    <View style={{ width: `${(starCount.threestar / data.totalReviews) * 100}%` }} className={`h-4 bg-[#FFE066] rounded-md absolute top-0 left-0`}></View>
                                </View>
                            </View>

                            <View className='flex flex-row items-center gap-3 mb-4'>
                                <Text>2</Text>
                                <YellowStar />
                                <View className='relative w-52'>
                                    <View className='w-full h-4 bg-slate-100 rounded-md'></View>
                                    <View style={{ width: `${(starCount.twostar / data.totalReviews) * 100}%` }} className={`h-4 bg-[#FFE066] rounded-md absolute top-0 left-0`}></View>
                                </View>
                            </View>

                            <View className='flex flex-row items-center gap-3 mb-4'>
                                <Text>1</Text>
                                <YellowStar />
                                <View className='relative w-52'>
                                    <View className='w-full h-4 bg-slate-100 rounded-md'></View>
                                    <View style={{ width: `${(starCount.onestar / data.totalReviews) * 100}%` }} className={`h-4 bg-[#FFE066] rounded-md absolute top-0 left-0`}></View>
                                </View>
                            </View>
                        </View>
                        <View className=''>
                            <Text className='text-5xl font-bold py-1 text-center'>{data.avgRating}{hasHalfStar ? ".5" : ""}</Text>
                            <View className="flex flex-row justify-center items-center">
                                {Array.from({ length: Math.floor(Number(data.avgRating)) }).map((_, idx) => (
                                    <YellowStar key={idx} />
                                ))}
                                {hasHalfStar && (
                                    <YellowStar style={{ opacity: 0.5 }} />
                                )}
                            </View>
                            <Text className="text-center text-xs text-gray-500 pt-1">{data.totalReviews} reviews</Text>
                        </View>
                    </View>
                    <View>
                        {data.reviews.map((review, index) => (
                            <View key={index} className='mb-6 border-b border-b-gray-200 pb-4'>
                                <Image source={review.reviewBy.profilePic ? { uri: review.reviewBy.profilePic } : require('../../assets/defaultPic.jpg')} className='w-10 h-10 rounded-full mr-3' />
                                <View className='flex flex-row justify-between items-center mb-2'>
                                    <Text className='font-semibold text-lg'>{review.reviewBy.firstName}</Text>
                                    <Text className='text-xs text-gray-500'>{timeDifference(review.createdAt)}</Text>
                                </View>
                                <View className="flex flex-row items-center mb-2">
                                    {Array.from({ length: review.stars }).map((_, idx) => (
                                        <YellowStar key={idx} />
                                    ))}
                                    {review.stars % 1 !== 0 && (
                                        <YellowStar style={{ opacity: 0.5 }} />
                                    )}
                                </View>
                                <Text className='text-secondary text-sm'>{review.feedbackMessage}</Text>
                            </View>
                        ))}

                    </View>
                </View>
            }
        </View>
    )
}

export default Review
