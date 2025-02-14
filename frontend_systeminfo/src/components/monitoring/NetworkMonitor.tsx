"use client"

import { useState, useEffect } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useWebSocket } from "@/utils/WebSocketContext"

interface NetworkData {
    time: string
    red_enviados: number
    red_recibidos: number
    conexiones_red: number
}

export default function NetworkMonitor() {
    const [networkData, setNetworkData] = useState<NetworkData[]>([])
    const data = useWebSocket()

    useEffect(() => {
        if (data) {
            setNetworkData((prevData) => {
                const newData = [
                    ...prevData,
                    {
                        time: new Date().toLocaleTimeString(),
                        red_enviados: parseFloat(data.red_enviados),
                        red_recibidos: parseFloat(data.red_recibidos),
                        conexiones_red: data.conexiones_red,
                    },
                ]
                return newData.slice(-20) // Mantener solo los últimos 20 puntos de datos
            })
        }
    }, [data])

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 text-black">Monitoreo de Red</h2>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={networkData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                        type="monotone"
                        dataKey="red_enviados"
                        stackId="1"
                        stroke="#8884d8"
                        fill="#8884d8"
                        name="Enviados (KB/s)"
                    />
                    <Area
                        type="monotone"
                        dataKey="red_recibidos"
                        stackId="1"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        name="Recibidos (KB/s)"
                    />
                </AreaChart>
            </ResponsiveContainer>
            <div className="mt-4">
                <h3 className="text-lg font-semibold text-black">Conexiones de Red Activas</h3>
                <p className="text-3xl font-bold text-blue-600">
                    {networkData.length > 0 ? networkData[networkData.length - 1].conexiones_red : 0}
                </p>
            </div>
        </div>
    )
}