# Introduction

MapStruct is a Java annotation processor for the generation of type-safe bean mapping classes.

All you have to do is to define a mapper interface which declares any required mapping methods. During compilation, MapStruct will generate an implementation of this interface. This implementation uses plain Java method invocations for mapping between source and target objects, i.e. no reflection or similar.

Compared to writing mapping code from hand, MapStruct saves time by generating code which is tedious and error-prone to write. Following a convention over configuration approach, MapStruct uses sensible defaults but steps out of your way when it comes to configuring or implementing special behavior.

Compared to dynamic mapping frameworks, MapStruct offers the following advantages:

Fast execution by using plain method invocations instead of reflection

Compile-time type safety: Only objects and attributes mapping to each other can be mapped, no accidental mapping of an order entity into a customer DTO etc.

Clear error-reports at build time, if

mappings are incomplete (not all target properties are mapped)

mappings are incorrect (cannot find a proper mapping method or type conversion)