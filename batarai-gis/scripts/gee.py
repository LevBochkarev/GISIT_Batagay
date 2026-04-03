import ee
import requests

# Авторизация (откроется окно для входа в Google)
ee.Authenticate()

# Инициализация с вашим проектом
ee.Initialize(project='gisit-492119')

# Проверка - должно работать
print('✅ GEE готов к работе!')

# Координаты Батагая
batagay_small = ee.Geometry.Polygon([
    # 134.589997667,134.692437676,67.634352181,67.673337907
    [[134.589, 67.6343], [134.589, 67.6733], [134.6924, 67.6733], [134.6924, 67.6343]]
])

# NDVI за лето 2024
s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED') \
    .filterDate('2024-07-01', '2024-07-15') \
    .filterBounds(batagay_small) \
    .first()

ndvi = s2.normalizedDifference(['B8', 'B4']).rename('NDVI')

# Скачивание
url = ndvi.getDownloadURL({
    'scale': 10,
    'region': batagay_small,
    'format': 'GeoTIFF'
})

response = requests.get(url)
with open('static/raster/batagay_ndvi.tif', 'wb') as f:
    f.write(response.content)

print('✅ Файл сохранён: batagay_ndvi.tif')
print('Размер:', round(len(response.content)/1024, 2), 'KB')