import React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { Check, X, AlertTriangle } from 'lucide-react-native'

export interface FooterCheck {
  label: string
  description: string
  status: 'checking' | 'success' | 'warning' | 'error'
  text?: string
}

interface SetupFooterCheckProps {
  check: FooterCheck
}

function StatusIcon ({ status }: { status: FooterCheck['status'] }) {
  switch (status) {
    case 'checking':
      return <ActivityIndicator size="small" color="#a1a1aa" />
    case 'success':
      return <Check size={14} color="#22c55e" />
    case 'warning':
      return <AlertTriangle size={14} color="#eab308" />
    case 'error':
      return <X size={14} color="#ef4444" />
  }
}

export function SetupFooterCheck ({ check }: SetupFooterCheckProps) {
  return (
    <View className="flex-row items-center">
      <View className="w-4 h-4 mr-2.5 items-center justify-center">
        <StatusIcon status={check.status} />
      </View>
      <Text className="text-foreground text-sm">{check.label} -&nbsp;</Text>
      <Text className="text-muted-foreground text-xs flex-1">
        {check.status === 'checking' ? check.description : (check.text ?? check.description)}
      </Text>
    </View>
  )
}
