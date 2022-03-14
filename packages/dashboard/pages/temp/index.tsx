import DropdownSelector from 'components/common/DropdownSelector';

function Temp() {
  return (
    <div>
      <DropdownSelector
        optionsTitle="Deployments"
        onClick={(val) => {
          console.log(val);
        }}
        list={[
          {
            key: '1',
            name: 'test',
            value: 'test',
          },
          {
            key: '2',
            name: 'test',
            value: 'test2',
          },
        ]}
      />
      <div>stestkljkljkljsad</div>
    </div>
  );
}

export default Temp;
