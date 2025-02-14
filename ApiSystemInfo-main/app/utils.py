import psutil

def get_system_resources():
    """Obtiene los recursos del sistema."""
    cpu_percent = psutil.cpu_percent(interval=1)
    memory_info = psutil.virtual_memory()
    disk_usage = psutil.disk_usage('/')
    net_io= psutil.net_io_counters()
    net_connections = psutil.net_connections()
    processes = []
    for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_info', 'status']):
        processes.append({
            'pid': proc.info['pid'],
            'name': proc.info['name'],
            'cpu_percent': proc.info['cpu_percent'],
            'memory': proc.info['memory_info'].rss / (1024 * 1024),  # Convert to MB
            'status': proc.info['status']
        })    
    return {
        'cpu_percent': cpu_percent,
        'memory_percent': memory_info.percent,
        'disk_percent': disk_usage.percent,
        'net_bytes_sent': net_io.bytes_sent,
        'net_bytes_recv': net_io.bytes_recv,
        'net_connections': len(net_connections),
        'processes': processes
    }