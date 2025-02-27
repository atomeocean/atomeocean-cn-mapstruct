# Introduction

<PasswordReveal correctPassword='123456' hint="输入密码以查看隐藏内容">

test contents

</PasswordReveal>

MapStruct is a Java annotation processor for the generation of type-safe bean mapping classes.

All you have to do is to define a mapper interface which declares any required mapping methods. During compilation, MapStruct will generate an implementation of this interface. This implementation uses plain Java method invocations for mapping between source and target objects, i.e. no reflection or similar.

Compared to writing mapping code from hand, MapStruct saves time by generating code which is tedious and error-prone to write. Following a convention over configuration approach, MapStruct uses sensible defaults but steps out of your way when it comes to configuring or implementing special behavior.

Compared to dynamic mapping frameworks, MapStruct offers the following advantages:

Fast execution by using plain method invocations instead of reflection

Compile-time type safety: Only objects and attributes mapping to each other can be mapped, no accidental mapping of an order entity into a customer DTO etc.

Clear error-reports at build time, if

mappings are incomplete (not all target properties are mapped)

mappings are incorrect (cannot find a proper mapping method or type conversion)

## 题目描述

给定一个字符串 `s` ，找出至多包含 `k` 个不同字符的最长子串 `T` 。

## 解题思路

### 视频讲解

<YoutubeEmbedCard videoUrl="https://www.youtube.com/embed/cT9jiDLNq6g?si=uchFsL9DmSk-3_U_" title="大神Leo英文流讲解, 欢迎订阅频道" />