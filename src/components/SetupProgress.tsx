import React from 'react'
import { View, Text } from 'react-native'
import { HardDrive, Network, Puzzle } from 'lucide-react-native'

interface SetupProgressProps {
  step: number
}

const STEP_PERCENTAGE = [85, 50, 15]

export function SetupProgress ({ step }: SetupProgressProps) {
  return (
    <View className="px-6 mt-14 w-full items-center pb-5">
      <View className="w-full max-w-4xl relative flex-row justify-around">
        <View className="absolute top-5 left-0 right-0 h-2.5 rounded-full bg-secondary overflow-hidden">
          <View className="h-full bg-white" style={{ width: `${100 - STEP_PERCENTAGE[step]}%` }} />
        </View>
        <View className="w-20 items-center z-10">
          <View className="w-12 h-12 rounded-full bg-foreground items-center justify-center">
            <HardDrive size={20} color="#09090b" />
          </View>
          <Text className="mt-3 font-bold text-foreground">Storage</Text>
        </View>
        <View className="w-20 items-center z-10">
          <View className={`w-12 h-12 rounded-full items-center justify-center ${step > 0 ? 'bg-foreground' : 'bg-secondary'}`}>
            <Network size={20} color={step > 0 ? '#09090b' : '#a1a1aa'} />
          </View>
          <Text className={`mt-3 font-bold ${step > 0 ? 'text-foreground' : 'text-muted-foreground'}`}>Network</Text>
        </View>
        <View className="w-20 items-center z-10">
          <View className={`w-12 h-12 rounded-full items-center justify-center ${step > 1 ? 'bg-foreground' : 'bg-secondary'}`}>
            <Puzzle size={20} color={step > 1 ? '#09090b' : '#a1a1aa'} />
          </View>
          <Text className={`mt-3 font-bold ${step > 1 ? 'text-foreground' : 'text-muted-foreground'}`}>Extensions</Text>
        </View>
      </View>
    </View>
  )
}
