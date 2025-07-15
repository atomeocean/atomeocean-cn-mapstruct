---
title: MapStruct 是什么？
outline: deep
---
### MapStruct 是什么？

**MapStruct** 是一个用于 Java bean 类的类型安全和高效映射器生成的 Java 注解处理器。它可以避免你手动编写映射代码，这是一项繁琐且容易出错的任务。生成器提供了合理的默认值和许多内置的类型转换，但当涉及到配置或实现特殊行为时，它不会妨碍你。

与在运行时工作的映射框架相比，MapStruct 提供以下优势：

- 通过使用普通方法调用而非反射，执行速度更快。
- 编译时类型安全。只有彼此映射的对象和属性才能映射，因此不会意外地将订单实体映射为客户 DTO 等。
- 独立的代码——没有运行时依赖。
- 在构建时报告清晰的错误，特别是：
  - 映射不完整（不是所有目标属性都映射了）。
  - 映射不正确（找不到适当的映射方法或类型转换）。
- 易于调试的映射代码（或手动编辑——例如在生成器中的错误情况下）。

要创建两个类型之间的映射，可以声明如下的映射器接口：

```java
@Mapper
public interface CarMapper {

    CarMapper INSTANCE = Mappers.getMapper( CarMapper.class );

    @Mapping(target = "seatCount", source = "numberOfSeats")
    CarDto carToCarDto(Car car);
}
```

在编译时，MapStruct 会生成此接口的实现。生成的实现使用普通的 Java 方法调用来在源对象和目标对象之间进行映射，即不涉及反射。默认情况下，如果源和目标中的属性名称相同，则会进行映射，但你可以使用 `@Mapping` 和其他一些注解来控制这一点以及许多其他方面。

### 要求

MapStruct 需要 Java 1.8 或更高版本。

### 使用 MapStruct

MapStruct 可以在命令行构建（如纯 `javac`、通过 Maven、Gradle、Ant 等）和 IDE 中使用。

对于 Eclipse，专用插件正在开发中（参见 [MapStruct Eclipse 插件](https://github.com/mapstruct/mapstruct-eclipse)）。它超越了注解处理器的功能，提供了注解属性的内容辅助、快速修复等功能。

对于 IntelliJ，插件可以在 IntelliJ 市场中获取（参见 [MapStruct IntelliJ 插件](https://plugins.jetbrains.com/plugin/10036-mapstruct-support)）。

### Maven

对于基于 Maven 的项目，添加以下内容到你的 `POM` 文件中以使用 MapStruct（依赖项可在 Maven Central 获取）：

```xml
<properties>
    <org.mapstruct.version>1.6.0</org.mapstruct.version>
</properties>

<dependencies>
    <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct</artifactId>
        <version>${org.mapstruct.version}</version>
    </dependency>
</dependencies>

<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.13.0</version>
            <configuration>
                <source>17</source>
                <target>17</target>
                <annotationProcessorPaths>
                    <path>
                        <groupId>org.mapstruct</groupId>
                        <artifactId>mapstruct-processor</artifactId>
                        <version>${org.mapstruct.version}</version>
                    </path>
                </annotationProcessorPaths>
            </configuration>
        </plugin>
    </plugins>
</build>
```

### Gradle

对于 Gradle，你需要类似以下的内容：

```groovy
plugins {
    ...
    id "com.diffplug.eclipse.apt" version "3.26.0" // 仅适用于 Eclipse
}

dependencies {
    ...
    implementation 'org.mapstruct:mapstruct:1.6.0'

    annotationProcessor 'org.mapstruct:mapstruct-processor:1.6.0'
    testAnnotationProcessor 'org.mapstruct:mapstruct-processor:1.6.0' // 如果你在测试代码中使用 MapStruct
}
```

如果你没有使用依赖管理工具，可以从 [Releases 页面](https://github.com/mapstruct/mapstruct/releases)获取分发包。

### 文档和获取帮助

要了解有关 MapStruct 的更多信息，请参阅项目主页。参考文档详细介绍了提供的所有功能。如果需要帮助，请在讨论区提出问题。

### 从源代码构建

MapStruct 使用 Maven 进行构建。构建 MapStruct 源代码需要 Java 11。要构建完整的项目，请运行：

```bash
./mvnw clean install
```

要跳过分发模块，运行：

```bash
./mvnw clean install -DskipDistribution=true
```

### 导入到 IDE

MapStruct 使用 gem 注解处理器为其自己的注解生成映射 gem。因此，为了在 IDE 中实现无缝集成，必须启用注解处理。

#### IntelliJ

确保你至少有 IntelliJ 2018.2.x（因为对 maven-compiler-plugin 的注解处理器的支持从该版本开始）。在 IntelliJ 中启用注解处理（构建、执行、部署 -> 编译器 -> 注解处理器）。

#### Eclipse

确保你安装了 `m2e_apt` 插件。

### 链接

- [项目主页](https://mapstruct.org)
- [源代码](https://github.com/mapstruct/mapstruct)
- [下载](https://github.com/mapstruct/mapstruct/releases)
- [问题追踪](https://github.com/mapstruct/mapstruct/issues)
- [用户组](https://groups.google.com/forum/#!forum/mapstruct-users)
- [CI 构建](https://ci.eclipse.org/mapstruct/)

### 许可

MapStruct 采用 Apache License 2.0 许可（“许可”）。你不能在不遵守许可的情况下使用此项目。你可以在 [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) 页面上获取许可副本。


