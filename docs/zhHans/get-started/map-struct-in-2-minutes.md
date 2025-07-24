
# 快速入门MapStruct (2分钟)

<ClientOnly>
  <GoogleAd
    adClient="ca-pub-5598390904013681"
    adSlot="2675515200"
    style="display:block;min-height:90px;margin:24px auto;"
  />
</ClientOnly>

:::code-group

```java [Car.java]
public class Car {
 
    private String make;
    private int numberOfSeats;
    private CarType type;
 
    //constructor, getters, setters etc.
}
```

```java [CarDto.java]
public class CarDto {
 
    private String make;
    private int seatCount;
    private String type;
 
    //constructor, getters, setters etc.
}
```
:::


:::code-group
```java [CarMapper.java]
@Mapper
public interface CarMapper {
 
    CarMapper INSTANCE = Mappers.getMapper( CarMapper.class );
 
    @Mapping(source = "numberOfSeats", target = "seatCount")
    CarDto carToCarDto(Car car);
}
```
:::

## 参考
- [MapStruct官方网站,点击get started](https://mapstruct.org/)
- [在vitepress中使用code group](https://vitepress.dev/guide/markdown#code-groups)
