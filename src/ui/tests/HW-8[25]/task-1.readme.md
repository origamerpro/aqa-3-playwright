Создайте 3 интеграционных теста для проверки следующих метрик на странице Home:
1. Orders This Year
2. New Customers
3. Canceled Orders

Для реализации подмокивайте респонс эндпоинта metrics

  - Orders This Year: Metrics.orders.totalOrders
  - New Customers: Metrics.customers.customers
  - Canceled Orders: Metrics.orders.totalCanceledOrders

Остальной объект оставьте как есть сейчас в респонсе, замените просто на ваши данные в метриках нужных