import asyncio
import json
import websockets
from utils import get_system_resources

async def send_system_info(websocket, path=None):
    print(f"Conexión WebSocket establecida con {websocket.remote_address}")
    try:
        while True:
            resources = get_system_resources()
            message = json.dumps({
                "cpu": f"{resources['cpu_percent']}%",
                "memoria": f"{resources['memory_percent']}%",
                "disco": f"{resources['disk_percent']}%",
                "red_enviados": f"{resources['net_bytes_sent'] / 1024:.2f} KB",
                "red_recibidos": f"{resources['net_bytes_recv'] / 1024:.2f} KB",
                "conexiones_red": resources['net_connections'],
                "procesos": resources['processes']
            }, ensure_ascii=False)
            await websocket.send(message)
            await asyncio.sleep(1)
    except websockets.exceptions.ConnectionClosed:
        print(f"Cliente WebSocket {websocket.remote_address} desconectado.")

async def main():
    start_websocket_server = websockets.serve(send_system_info, '0.0.0.0', 8765)
    await start_websocket_server
    try:
        await asyncio.Future()  # Run forever
    except asyncio.CancelledError:
        print("Servidor detenido manualmente.")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nServidor detenido manualmente.")