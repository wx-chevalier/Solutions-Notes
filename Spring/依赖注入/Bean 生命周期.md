# Bean 生命周期

## BeanFactoryPostProcessor 接口

通过 BeanFactoryPostProcessor 提供的 beanFactory 进行 Bean 的注册，常规的自定义 Bean 可以完全由此加载

```java
@Configuration
public class SelfBeanFactoryLoader implements BeanFactoryPostProcessor {

	@Override
	public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
		beanFactory.registerSingleton("windowQpsControl", new WindowQpsControl( ));
	}
}
```

## BeanDefinitionRegistryPostProcessor 接口

这个接口是继承自 BeanFactoryPostProcessor Bean 注册相关的可以参考上文：

```java
@Configuration
public class SelfBeanLoader implements BeanDefinitionRegistryPostProcessor {
	@Override
	public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
	}

	@Override
	public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry) throws BeansException {
		AnnotatedGenericBeanDefinition cacheHelper = new AnnotatedGenericBeanDefinition(CacheHelper.class);
		registry.registerBeanDefinition("cacheHelper", cacheHelper);
	}

}
```

## ApplicationContextAware

这个接口比较靠后也是大家使用比较多的，在前两者 Bean 的基础上，增加 xml 注入，而且这里给出了另外一个参数 environment，便于用户在此注入特殊的 profile。

```java
@Configuration
public class SelfContextLoader implements ApplicationContextAware {

	private ApplicationContext context;

	@Override
	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		this.context = applicationContext;
		addBeans();
	}

	private void addBeans() {
		if (this.context instanceof ConfigurableApplicationContext) {
			ConfigurableListableBeanFactory factory = ((ConfigurableApplicationContext) this.context).getBeanFactory();
			Environment environment = context.getEnvironment();
			System.out.println("......environment :" + environment);
			factory.registerSingleton("client", new Client());
			try {
				if (factory instanceof BeanDefinitionRegistry) {
					// 加载XML
					ResourcePatternResolver rp = new PathMatchingResourcePatternResolver();

					Resource[] resources = rp.getResources("classpath*:inner.xml"); // 加载A
					new XmlBeanDefinitionReader((DefaultListableBeanFactory) factory).loadBeanDefinitions(resources);
				}
			} catch (Exception e) {
				e.printStackTrace();
			}

		} else {
			throw new RuntimeException(" the environment is wrong !!!");
		}
	}

}
```
