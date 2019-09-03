# Spring TaskScheduler

# Ticker

```java
@Component
public class Ticker {
  private final TaskScheduler taskScheduler;
  private final Long monitorMeasurementIntervalMS;
  private final List<TickListener> listeners = new ArrayList<>();

  public Ticker(TaskScheduler taskScheduler, ApplicationProperty applicationProperty) {
    this.taskScheduler = taskScheduler;
    this.monitorMeasurementIntervalMS = applicationProperty.getMonitorMeasurementIntervalMS();
  }

  @PostConstruct
  public void init() {
    this.taskScheduler.scheduleAtFixedRate(
        this::execute, Duration.ofMillis(monitorMeasurementIntervalMS));
  }

  @PreDestroy
  public void destroy() {}

  private void execute() {
    for (TickListener listener : listeners) {
      listener.onTick();
    }
  }

  public void register(TickListener listener) {
    listeners.add(listener);
  }

  public void unregister(TickListener tickListener) {
    listeners.remove(tickListener);
  }

  public interface TickListener {
    void onTick();
  }
}
```

# 链接

- https://www.baeldung.com/spring-task-scheduler
