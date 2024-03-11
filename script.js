fetch('https://api.github.com/repos/markjouh/marksite/contents/')
  .then(response => response.json())
  .then(data => {
    const fileList = document.getElementById('file-list');
    data.forEach(file => {
      if (file.name.endsWith('.txt')) {
        const link = document.createElement('a');
        link.href = file.download_url;
        link.innerText = file.name;
        link.target = '_blank';
        fileList.appendChild(link);
        fileList.appendChild(document.createElement('br'));
      }
    });
  });
