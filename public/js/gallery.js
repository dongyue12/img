// 图片库功能
document.addEventListener('DOMContentLoaded', function() {
    // 复制链接功能
    window.copyLink = function(url) {
        navigator.clipboard.writeText(url).then(() => {
            alert('链接已复制到剪贴板！');
        }).catch(err => {
            console.error('复制失败:', err);
            // 降级方案
            const input = document.createElement('input');
            input.value = url;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            alert('链接已复制到剪贴板！');
        });
    };

    // 格式化文件大小
    window.formatFileSize = function(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };
});
