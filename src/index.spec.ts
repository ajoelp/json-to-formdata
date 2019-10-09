import objectToFormData from "./index";

const formData = new FormData();

beforeEach(() => {
    formData.append = jest.fn();
});

describe('Object to form data', () => {

    describe('object', () => {

        it('will map an object', () => {
            objectToFormData({
                foo: 'bar',
                bar: 'baz'
            }, {}, formData);

            expect(formData.append).toHaveBeenCalledWith('foo', 'bar');
            expect(formData.append).toHaveBeenCalledWith('bar', 'baz');

        });

        it('will map an nested object', () => {
            objectToFormData({
                foo: 'bar',
                bar: {
                    baz: 'foo'
                }
            }, {}, formData);

            expect(formData.append).toHaveBeenCalledWith('foo', 'bar');
            expect(formData.append).toHaveBeenCalledWith('bar[baz]', 'foo');

        })
    });

    describe('file', () => {

        it('will append a file', () => {

            const file = new File([], '');

            objectToFormData({
                foo: file,
            }, {}, formData);

            expect(formData.append).toHaveBeenCalledWith('foo', file);
        })

        it('will append a blob', () => {

            const blob = new Blob();

            objectToFormData({
                foo: blob,
            }, {}, formData);

            expect(formData.append).toHaveBeenCalledWith('foo', blob);
        })
    });

    describe('null', () => {

        it('will append a null value', () => {

            objectToFormData({
                foo: null,
            }, { excludeNull: false }, formData);

            expect(formData.append).toHaveBeenCalledWith('foo', '');
        })
    });

    describe('boolean', () => {

        it('will append boolean', () => {

            objectToFormData({
                foo: true,
                bar: false,
                baz: {
                    boolean: false
                }
            }, {}, formData);

            expect(formData.append).toHaveBeenCalledWith('foo', 'true');
            expect(formData.append).toHaveBeenCalledWith('bar', 'false');
            expect(formData.append).toHaveBeenCalledWith('baz[boolean]', 'false');
        })
    });

    describe('array', () => {

        it('will append array', () => {

            objectToFormData({
                foo: true,
                bar: false,
                baz: [
                    1,
                    2,
                    3
                ]
            }, { }, formData);

            expect(formData.append).toHaveBeenCalledWith('foo', 'true');
            expect(formData.append).toHaveBeenCalledWith('bar', 'false');
            expect(formData.append).toHaveBeenCalledWith('baz[0]', 1);
            expect(formData.append).toHaveBeenCalledWith('baz[1]', 2);
            expect(formData.append).toHaveBeenCalledWith('baz[2]', 3);
        });


        it('will append array of objects', () => {

            objectToFormData({
                foo: true,
                bar: false,
                baz: [
                    {id: 1},
                    {id: 2},
                    {id: 3},
                ]
            }, {}, formData);

            expect(formData.append).toHaveBeenCalledWith('foo', 'true');
            expect(formData.append).toHaveBeenCalledWith('bar', 'false');
            expect(formData.append).toHaveBeenCalledWith('baz[0][id]', 1);
            expect(formData.append).toHaveBeenCalledWith('baz[1][id]', 2);
            expect(formData.append).toHaveBeenCalledWith('baz[2][id]', 3);
        })
    });
});
