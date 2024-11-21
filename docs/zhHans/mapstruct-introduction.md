# 介绍
MapStruct 是一个用于生成类型安全的 bean 映射类的 Java 注解处理器。

你只需定义一个映射器接口，在该接口中声明所有需要的映射方法。在编译期间，MapStruct 将生成该接口的实现。这个实现使用普通的 Java 方法调用来进行源对象和目标对象之间的映射，即不使用反射或类似技术。

与手写映射代码相比，MapStruct 通过生成繁琐且容易出错的代码，节省了大量时间。它遵循约定优于配置的原则，提供了合理的默认值，但在配置或实现特殊行为时，它不会干扰你的操作。

与动态映射框架相比，MapStruct 提供以下优势：

通过使用普通的方法调用而不是反射，执行速度更快
编译时类型安全：只有彼此映射的对象和属性才能映射，不会出现将订单实体错误映射到客户 DTO 的情况
在构建时提供清晰的错误报告：
如果映射不完整（不是所有目标属性都被映射）
如果映射不正确（找不到适当的映射方法或类型转换）